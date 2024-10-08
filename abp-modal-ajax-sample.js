$(document).ready(function () {
            
    //new command modal
    let newExecutionModal = new abp.ModalManager({
        viewUrl: '/Devices/Executions/ExecuteCommandModal',
        scriptUrl: '/Pages/Devices/Executions/ExecuteCommandModal.cshtml.js',
        modalClass: 'newExecutionModal' //use to attache script
    });

    $('#newExecutionModal').click(function(){
        newExecutionModal.open();
    });

    // script to execute on modal init
    abp.modals.newExecutionModal = function () {

        function initModal(modalManager, args) {
            var $modal = modalManager.getModal();
            var $form = modalManager.getForm();

            $form.abpAjaxForm({
                beforeSubmit : function (){
                    // return false to prevent modal close
                    return false;
                }
            });

            $modal.find('h3').css('color', 'red');

            console.log('initialized the modal...');

            // Récupérer les groupes
            function fetchGroups() {
                abp.ajax({
                    url: '/api/app/ussd-group',
                    type: 'GET'
                }).done(function(data) {
                    const groupSelect = document.getElementById('groupSelect');
                    groupSelect.innerHTML = '<option value="">Sélectionnez un groupe</option>';
                    data.items.forEach(group => {
                        const option = document.createElement('option');
                        option.value = group.id;
                        option.textContent = group.name;
                        groupSelect.appendChild(option);
                    });
                }).fail(function(error) {
                    alert("Erreur lors de la récupération des groupes.");
                });
            }
            fetchGroups();

            // Récupérer les commandes
            function fetchCommands() {
                abp.ajax({
                    url: '/api/app/ussd-command',
                    type: 'GET'
                }).done(function(data) {
                    const commandSelect = document.getElementById('commandSelect');
                    commandSelect.innerHTML = '<option value="">Sélectionnez une commande</option>';
                    data.items.forEach(command => {
                        const option = document.createElement('option');
                        option.value = command.id;
                        option.textContent = command.name;
                        commandSelect.appendChild(option);
                    });
                }).fail(function(error) {
                    alert("Erreur lors de la récupération des commandes.");
                });
            }
            fetchCommands();

            // Récupérer les steps selon la commande sélectionnée
            function fetchSteps(commandId) {
                abp.ajax({
                    //url: `/api/ussd/commands/${commandId}/steps`,
                    url: `/api/app/ussd-state?CommandId=${commandId}`,
                    type: 'GET'
                }).done(function(data) {
                    const stepSelect = document.getElementById('stepSelect');
                    stepSelect.innerHTML = '<option value="">Sélectionnez une étape</option>';
                    stepSelect.disabled = false;
                    data.items.forEach(step => {
                        const option = document.createElement('option');
                        option.value = step.id;
                        option.textContent = step.ussdCode;
                        stepSelect.appendChild(option);
                    });
                }).fail(function(error) {
                    alert("Erreur lors de la récupération des étapes.");
                });
            }
            // Gérer la sélection de la commande pour charger les étapes
            document.getElementById('commandSelect').addEventListener('change', function() {
                const selectedCommandId = this.value;
                if (selectedCommandId) {
                    fetchSteps(selectedCommandId);
                } else {
                    document.getElementById('stepSelect').innerHTML = '<option value="">Sélectionnez une étape</option>';
                    document.getElementById('stepSelect').disabled = true;
                }
            });

            // Récupérer les KPI
            // Simulation des données pour les commandes, steps, groupes et devices
            /*const commands = [
                { id: 1, name: "Commande 1", steps: ["Step 1", "Step 2", "Step 3"] },
                { id: 2, name: "Commande 2", steps: ["Step A", "Step B", "Step C"] }
            ];

            const groups = [
                { id: 1, name: "Groupe 1" },
                { id: 2, name: "Groupe 2" }
            ];

            const devices = [
                { id: 1, name: "Device 1" },
                { id: 2, name: "Device 2" }
            ];*/

            //fetchCommands();
            //fetchGroups();

            // Récupérer les devices
            function fetchDevices() {
                abp.ajax({
                    url: '/api/app/proxy',
                    type: 'GET'
                }).done(function(data) {
                    const deviceSelect = document.getElementById('deviceSelect');
                    deviceSelect.innerHTML = '<option value="">Sélectionnez un appareil</option>';
                    data.items.forEach(device => {
                        const option = document.createElement('option');
                        option.value = device.id;
                        option.textContent = device.deviceName;
                        deviceSelect.appendChild(option);
                    });
                }).fail(function(error) {
                    alert("Erreur lors de la récupération des appareils.");
                });
            }
            fetchDevices();
/*
            // Charger les options des commandes
            const commandSelect = document.getElementById('commandSelect');
            commands.forEach(command => {
                const option = document.createElement('option');
                option.value = command.id;
                option.textContent = command.name;
                commandSelect.appendChild(option);
            });

            // Charger les options des groupes
            const groupSelect = document.getElementById('groupSelect');
            groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = group.name;
                groupSelect.appendChild(option);
            });

            // Charger les options des devices
            const deviceSelect = document.getElementById('deviceSelect');
            devices.forEach(device => {
                const option = document.createElement('option');
                option.value = device.id;
                option.textContent = device.name;
                deviceSelect.appendChild(option);
            });

            // Gestion du changement de commande pour charger les steps
            commandSelect.addEventListener('change', function() {
                const selectedCommandId = parseInt(this.value);
                const stepSelect = document.getElementById('stepSelect');
                stepSelect.innerHTML = '<option value="">Sélectionnez une étape</option>'; // Réinitialiser les steps
                stepSelect.disabled = false;

                const selectedCommand = commands.find(cmd => cmd.id === selectedCommandId);
                if (selectedCommand) {
                    selectedCommand.steps.forEach(step => {
                        const option = document.createElement('option');
                        option.value = step;
                        option.textContent = step;
                        stepSelect.appendChild(option);
                    });
                }
            });
*/
            // Soumettre le formulaire et exécuter la commande
            document.getElementById('ussdForm').addEventListener('submit', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                const commandId = commandSelect.value;
                const step = document.getElementById('stepSelect').value;
                const groupId = groupSelect.value;
                const deviceId = deviceSelect.value;
                const manualInput = document.getElementById('manualInput').value;

                if (commandId && step && groupId && deviceId) {
                    // Logique d'exécution de la commande
                    const resultArea = document.getElementById('resultArea');
                    resultArea.value = `Commande exécutée avec succès :
                                        - Commande: ${commandId}
                                        - Étape: ${step}
                                        - Groupe: ${groupId}
                                        - Appareil: ${deviceId}
                                        - Saisie manuelle: ${manualInput || "N/A"}`;
                } else {
                    alert('Veuillez remplir tous les champs.');
                }
            });
        }

        return {
            initModal: initModal
        };
    };


    // Initialisation de la table DataTables
    let table = $('#commandExecutionTable').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: '/api/app/command-execution-log/executions',
            data: function (d) {
                d.commandName = $('#commandNameFilter').val();
                d.status = $('#statusFilter').val();
                d.operator = $('#operatorFilter').val();
            }
        },
        columns: [
            { data: 'commandName' },
            { data: 'deviceId' },
            { data: 'operator' },
            { data: 'status' },
            { data: 'executedAt' },
            { data: 'retryCount' },
            {
                data: null,
                render: function (data, type, row) {
                    var buttons = '';
                    if (row.status === 'Failure') {
                        buttons += '<button class="btn btn-warning" onclick="reExecuteCommand(' + row.id + ')">Réexécuter</button>';
                    }
                    return buttons;
                }
            }
        ]
    });

    // Application des filtres
    $('#filterBtn').on('click', function () {
        table.ajax.reload();
    });
});

// Fonction pour réexécuter une commande échouée
function reExecuteCommand(executionId) {
    if (confirm('Êtes-vous sûr de vouloir réexécuter cette commande ?')) {
        abp.ajax({
            url: '/api/commandexecution/reexecute/' + executionId,
            type: 'POST'
        }).done(function () {
            abp.notify.success('Commande réexécutée avec succès.');
            $('#commandExecutionTable').DataTable().ajax.reload();
        }).fail(function (error) {
            abp.notify.error('Erreur lors de la ré exécution de la commande.');
        });
    }
}
