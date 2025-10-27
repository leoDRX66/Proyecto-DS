document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const selector = document.getElementById('document-type');
    const formContainer = document.getElementById('form-container');
    const formTitle = document.getElementById('form-title');
    const downloadSection = document.getElementById('download-section');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const addMedBtn = document.getElementById('add-medicamento-btn');
    const medicamentosList = document.getElementById('medicamentos-list');

    const forms = {
        receta: document.getElementById('form-receta'),
        parte: document.getElementById('form-parte'),
        orden: document.getElementById('form-orden')
    };

    let generatedContent = '';
    let documentName = '';

    // --- MANEJADOR DEL MENÚ PRINCIPAL (LÓGICA CORREGIDA) ---
    selector.addEventListener('change', () => {
        const selectedValue = selector.value;
        const titles = {
            receta: 'Nueva Receta Médica',
            parte: 'Nuevo Parte Médico',
            orden: 'Nueva Orden Médica'
        };

        // 1. Busca si ya hay un formulario visible.
        const currentlyVisibleForm = document.querySelector('.document-form.visible');
        if (currentlyVisibleForm) {
            // Si lo hay, le quita la clase 'visible' para que inicie su animación de salida.
            currentlyVisibleForm.classList.remove('visible');
            
            // 2. Después de que termine la animación (500ms), le añade la clase 'hidden' para ocultarlo por completo.
            setTimeout(() => {
                currentlyVisibleForm.classList.add('hidden');
            }, 500); // Este tiempo debe coincidir con la duración de la transición en el CSS.
        }

        // 3. Si el usuario ha seleccionado una opción válida...
        if (selectedValue) {
            const selectedForm = forms[selectedValue];
            formTitle.textContent = titles[selectedValue];

            // 4. Le quita la clase 'hidden' para que ocupe su espacio en la página.
            selectedForm.classList.remove('hidden');
            
            // 5. Con un pequeño retardo, le añade la clase 'visible' para activar la animación de entrada.
            //    Esto asegura que el navegador procese el cambio de 'display' antes de iniciar la animación.
            setTimeout(() => {
                selectedForm.classList.add('visible');
            }, 10);
        } else {
            // Si el usuario selecciona la opción por defecto ("Seleccione..."), se limpia el título.
            formTitle.textContent = '';
        }
    });

    // --- FUNCIÓN PARA REINICIAR LA INTERFAZ ---
    const resetUI = () => {
        downloadSection.classList.remove('visible');
        setTimeout(() => downloadSection.classList.add('hidden'), 500);

        Object.values(forms).forEach(form => {
            form.classList.remove('visible');
            form.reset();
            setTimeout(() => form.classList.add('hidden'), 500);
        });

        const extraMedicamentos = medicamentosList.querySelectorAll('.medicamento-item:not(:first-child)');
        extraMedicamentos.forEach(item => item.remove());

        formTitle.textContent = '';
        selector.value = '';
    };
    resetBtn.addEventListener('click', resetUI);

    // --- LÓGICA PARA AÑADIR MEDICAMENTOS ---
    addMedBtn.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.classList.add('form-group', 'medicamento-item');

        const label = document.createElement('label');
        label.textContent = 'Medicamento Adicional:';
        
        const medInput = document.createElement('input');
        medInput.type = 'text';
        medInput.name = 'medicamento[]';
        medInput.placeholder = 'Otro medicamento';
        medInput.required = true;

        const indInput = document.createElement('input');
        indInput.type = 'text';
        indInput.name = 'indicacion[]';
        indInput.placeholder = 'Indicación';
        indInput.required = true;
        
        newItem.appendChild(label);
        newItem.appendChild(medInput);
        newItem.appendChild(indInput);
        medicamentosList.appendChild(newItem);
    });

    // --- LÓGICA PARA BOTONES DE DÍAS ---
    document.querySelectorAll('.dias-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.dias-btn').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            document.getElementById('dias-licencia').value = button.dataset.dias;
        });
    });

    // --- MANEJO DEL ENVÍO DE FORMULARIOS ---
    Object.values(forms).forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            let data;
            
            if (form.id === 'form-receta') {
                data = {
                    paciente: formData.get('paciente'),
                    medicamentos: formData.getAll('medicamento[]'),
                    indicaciones: formData.getAll('indicacion[]')
                };
            } else {
                data = Object.fromEntries(formData.entries());
            }

            form.classList.remove('visible');
            formTitle.textContent = '';
            
            generateFileContent(form.id, data);

            downloadSection.classList.remove('hidden');
            setTimeout(() => downloadSection.classList.add('visible'), 10);
        });
    });
    
    // --- GENERACIÓN DE CONTENIDO DEL ARCHIVO ---
    function generateFileContent(formId, data) {
        let content = `--- DOCUMENTO MÉDICO GENERADO ---\n\n`;
        const patient = data.paciente || 'N/A';
        
        if (formId === 'form-receta') {
            documentName = `Receta-${patient.replace(/\s/g, '_')}.txt`;
            downloadBtn.textContent = 'Descargar Receta';
            content += `TIPO: Receta Médica\nPACIENTE: ${patient}\n\nMEDICAMENTOS:\n`;
            data.medicamentos.forEach((medicamento, index) => {
                const indicacion = data.indicaciones[index] || 'Sin indicación';
                content += `- ${medicamento}: ${indicacion}\n`;
            });
        } else if (formId === 'form-parte') {
            documentName = `Parte-${patient.replace(/\s/g, '_')}.txt`;
            downloadBtn.textContent = 'Descargar Parte Médico';
            content += `TIPO: Parte Médico\nPACIENTE: ${patient}\nDIAGNÓSTICO: ${data.diagnostico}\nLICENCIA: ${data.dias_licencia}\n`;
        } else if (formId === 'form-orden') {
            documentName = `Orden-${patient.replace(/\s/g, '_')}.txt`;
            downloadBtn.textContent = 'Descargar Orden Médica';
            content += `TIPO: Orden Médica\nPACIENTE: ${patient}\nTIPO DE ESTUDIO: ${data.tipo_estudio}\nDETALLES: ${data.detalles}\n`;
        }
        
        generatedContent = content;
    }

    // --- MANEJADOR DEL BOTÓN DE DESCARGA ---
    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([generatedContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = documentName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});