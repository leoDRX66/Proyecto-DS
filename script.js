// --- DATOS DE MÉDICOS FICTICIOS ---
// (Este es el nuevo bloque de datos)
const medicos = [
    { nombre: "Dra. Elena Ramírez", especializacion: "Cardiología", matricula: "MN 12345" },
    { nombre: "Dr. Carlos Gutiérrez", especializacion: "Pediatría", matricula: "MN 12346" },
    { nombre: "Dra. Sofía Torres", especializacion: "Dermatología", matricula: "MN 12347" },
    { nombre: "Dr. Juan Pérez", especializacion: "Traumatología", matricula: "MN 12348" },
    { nombre: "Dra. Lucía Morales", especializacion: "Ginecología", matricula: "MN 12349" },
    { nombre: "Dr. Mateo Fernández", especializacion: "Neurología", matricula: "MN 12350" },
    { nombre: "Dra. Valentina Díaz", especializacion: "Oftalmología", matricula: "MN 12351" },
    { nombre: "Dr. Diego Ruiz", especializacion: "Otorrinolaringología", matricula: "MN 12352" },
    { nombre: "Dra. Camila Acosta", especializacion: "Endocrinología", matricula: "MN 12353" },
    { nombre: "Dr. Santiago Gómez", especializacion: "Urología", matricula: "MN 12354" },
    { nombre: "Dra. Isabel Herrera", especializacion: "Psiquiatría", matricula: "MN 12355" },
    { nombre: "Dr. Martín Castro", especializacion: "Gastroenterología", matricula: "MN 12356" },
    { nombre: "Dra. Paula Silva", especializacion: "Neumología", matricula: "MN 12357" },
    { nombre: "Dr. Lucas Romero", especializacion: "Reumatología", matricula: "MN 12358" },
    { nombre: "Dra. Gabriela Núñez", especializacion: "Hematología", matricula: "MN 12359" },
    { nombre: "Dr. Nicolás Molina", especializacion: "Infectología", matricula: "MN 12360" },
    { nombre: "Dra. Julieta Rivas", especializacion: "Medicina General", matricula: "MN 12361" },
    { nombre: "Dr. Facundo Alonso", especializacion: "Cirugía General", matricula: "MN 12362" },
    { nombre: "Dra. Agustina Vega", especializacion: "Nefrología", matricula: "MN 12363" },
    { nombre: "Dr. Tomás Mendoza", especializacion: "Oncología", matricula: "MN 12364" }
];


document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const selector = document.getElementById('document-type');
    const formContainer = document.getElementById('form-container');
    const formTitle = document.getElementById('form-title');
    const downloadSection = document.getElementById('download-section');
    const downloadBtn = document.getElementById('download-btn');
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // ! NOTA: Tu HTML no tiene un "reset-btn". 
    // ! Si lo añades, este código funcionará.
    // const resetBtn = document.getElementById('reset-btn'); 
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const addMedBtn = document.getElementById('add-medicamento-btn');
    const medicamentosList = document.getElementById('medicamentos-list');
    
    // --- (NUEVO) Seleccionamos TODOS los menús de doctores ---
    const doctorDropdowns = document.querySelectorAll('.doctor-select');

    const forms = {
        receta: document.getElementById('form-receta'),
        parte: document.getElementById('form-parte'),
        orden: document.getElementById('form-orden')
    };

    let generatedContent = '';
    let documentName = '';

    // --- (NUEVO) FUNCIÓN PARA POBLAR LOS MENÚS DE DOCTORES ---
    function populateDoctorDropdowns() {
        doctorDropdowns.forEach(dropdown => {
            // Limpiar opciones previas (excepto la primera)
            while (dropdown.options.length > 1) {
                dropdown.remove(1);
            }
            
            // Añadir cada médico como una opción
            medicos.forEach(medico => {
                const option = document.createElement('option');
                // El valor será el "Firma"
                option.value = `${medico.nombre} - ${medico.especializacion} - Mat. ${medico.matricula}`;
                // El texto visible será más amigable
                option.textContent = `${medico.nombre} (${medico.especializacion})`;
                dropdown.appendChild(option);
            });
        });
    }

    // --- (NUEVO) Llamamos a la función al cargar la página ---
    populateDoctorDropdowns();


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
    // Tu HTML no incluye un 'reset-btn', pero si lo añades,
    // esta función (que ya tenías) lo manejará.
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
    // resetBtn.addEventListener('click', resetUI); // Descomenta si añades el botón

    // --- LÓGICA PARA AÑADIR MEDICAMENTOS ---
    addMedBtn.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.classList.add('form-group', 'medicamento-item');
        
        newItem.innerHTML = `
            <label>Medicamento Adicional:</label>
            <br>
            <input type-="text" name="medicamento[]" placeholder="Otro medicamento" required>
            <br>
            <label>Indicación:</label>
            <br>
            <input type="text" name="indicacion[]" placeholder="Indicación" required>
        `;
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
                    indicaciones: formData.getAll('indicacion[]'),
                    // (NUEVO) Capturamos el doctor
                    doctor: formData.get('doctor_seleccionado') 
                };
            } else {
                data = Object.fromEntries(formData.entries());
                // (NUEVO) Capturamos el doctor (ya está en formData, 
                // pero lo renombramos para consistencia)
                data.doctor = data.doctor_seleccionado; 
            }

            form.classList.remove('visible');
            formTitle.textContent = '';
            
            generateFileContent(form.id, data);

            downloadSection.classList.remove('hidden');
            setTimeout(() => downloadSection.classList.add('visible'), 10);
        });
    });
    
    // --- GENERACIÓN DE CONTENIDO DEL ARCHIVO (MODIFICADO) ---
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
        
        // (NUEVO) Añadimos la firma del doctor al final de CUALQUIER documento
        content += `\n\n\n------------------------------------\n`;
        content += `Firma del Profesional:\n`;
        content += `${data.doctor}\n`; // data.doctor contiene el string "Nombre - Especialidad - Matrícula"
        
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