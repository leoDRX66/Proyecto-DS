// --- DATOS DE MÉDICOS FICTICIOS ---
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
    // --- (NUEVO) Importar el constructor de jsPDF ---
    // Asegúrate de que jsPDF esté cargado en tu HTML
    const { jsPDF } = window.jspdf;

    // --- ELEMENTOS DEL DOM ---
    const selector = document.getElementById('document-type');
    const formContainer = document.getElementById('form-container');
    const formTitle = document.getElementById('form-title');
    
    // (ELIMINADOS) 'downloadSection' y 'downloadBtn' ya no son necesarios
    
    const addMedBtn = document.getElementById('add-medicamento-btn');
    const medicamentosList = document.getElementById('medicamentos-list');
    const doctorDropdowns = document.querySelectorAll('.doctor-select');

    const forms = {
        receta: document.getElementById('form-receta'),
        parte: document.getElementById('form-parte'),
        orden: document.getElementById('form-orden')
    };
    
    // (ELIMINADAS) 'generatedContent' y 'documentName' globales

    // --- FUNCIÓN PARA POBLAR LOS MENÚS DE DOCTORES ---
    function populateDoctorDropdowns() {
        doctorDropdowns.forEach(dropdown => {
            while (dropdown.options.length > 1) {
                dropdown.remove(1);
            }
            medicos.forEach(medico => {
                const option = document.createElement('option');
                option.value = `${medico.nombre} - ${medico.especializacion} - Mat. ${medico.matricula}`;
                option.textContent = `${medico.nombre} (${medico.especializacion})`;
                dropdown.appendChild(option);
            });
        });
    }
    populateDoctorDropdowns();

    // --- MANEJADOR DEL MENÚ PRINCIPAL (Sin cambios) ---
    selector.addEventListener('change', () => {
        const selectedValue = selector.value;
        const titles = {
            receta: 'Nueva Receta Médica',
            parte: 'Nuevo Parte Médico',
            orden: 'Nueva Orden Médica'
        };

        const currentlyVisibleForm = document.querySelector('.document-form.visible');
        if (currentlyVisibleForm) {
            currentlyVisibleForm.classList.remove('visible');
            setTimeout(() => {
                currentlyVisibleForm.classList.add('hidden');
            }, 500); 
        }

        if (selectedValue) {
            const selectedForm = forms[selectedValue];
            formTitle.textContent = titles[selectedValue];
            selectedForm.classList.remove('hidden');
            setTimeout(() => {
                selectedForm.classList.add('visible');
            }, 10);
        } else {
            formTitle.textContent = '';
        }
    });

    // --- (MODIFICADA) FUNCIÓN PARA REINICIAR LA INTERFAZ ---
    const resetUI = () => {
        // (ELIMINADO) Código que manejaba 'downloadSection'
        
        Object.values(forms).forEach(form => {
            form.classList.remove('visible');
            form.reset();
            setTimeout(() => form.classList.add('hidden'), 500);
        });

        // Limpia medicamentos adicionales
        const extraMedicamentos = medicamentosList.querySelectorAll('.medicamento-item:not(:first-child)');
        extraMedicamentos.forEach(item => item.remove());

        formTitle.textContent = '';
        selector.value = '';
    };

    // --- LÓGICA PARA AÑADIR MEDICAMENTOS (Sin cambios) ---
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

    // --- LÓGICA PARA BOTONES DE DÍAS (Sin cambios) ---
    document.querySelectorAll('.dias-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.dias-btn').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            document.getElementById('dias-licencia').value = button.dataset.dias;
        });
    });

    // --- (MODIFICADO) MANEJO DEL ENVÍO DE FORMULARIOS ---
    Object.values(forms).forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            
            // Usamos Object.fromEntries para capturar TODOS los campos fácilmente
            let data = Object.fromEntries(formData.entries());
            data.doctor = data.doctor_seleccionado; // Renombramos para claridad

            // Casos especiales (campos múltiples)
            if (form.id === 'form-receta') {
                data.medicamentos = formData.getAll('medicamento[]');
                data.indicaciones = formData.getAll('indicacion[]');
            }

            // 1. Genera el PDF y dispara la descarga
            generateFileContent(form.id, data);

            // 2. Resetea la UI para volver al inicio
            resetUI();
        });
    });
    
    // --- (REESCRITO) GENERACIÓN DE CONTENIDO AHORA EN PDF ---
    function generateFileContent(formId, data) {
        // 1. Crear un nuevo documento PDF
        const doc = new jsPDF();
        
        let documentName = '';
        const patient = data.paciente || 'N/A';
        let y = 20; // Posición Y inicial (margen superior)
        const margin = 15; // Margen izquierdo
        const lineHeight = 8; // Espacio entre líneas
        const anchoMaximo = 180; // Ancho máximo del texto antes de cortar línea

        // Título del documento
        doc.setFontSize(18);
        doc.text("DOCUMENTO MÉDICO", margin, y);
        y += lineHeight * 2; // Doble espacio

        doc.setFontSize(12);

        if (formId === 'form-receta') {
            documentName = `Receta-${patient.replace(/\s/g, '_')}.pdf`;
            doc.text(`TIPO: Receta Médica`, margin, y); y += lineHeight;
            doc.text(`FECHA: ${data.paciente_fecha || 'N/A'}`, margin, y); y += lineHeight * 1.5;

            doc.text(`PACIENTE: ${patient}`, margin, y); y += lineHeight;
            doc.text(`DNI: ${data.paciente_dni || 'N/A'}`, margin, y); y += lineHeight;
            doc.text(`EDAD: ${data.paciente_edad || 'N/A'}`, margin, y); y += lineHeight;
            doc.text(`OBRA SOCIAL: ${data.paciente_os || 'N/A'}`, margin, y); y += lineHeight * 1.5;

            doc.setFontSize(14);
            doc.text("MEDICAMENTOS:", margin, y); y += lineHeight;
            doc.setFontSize(12);
            data.medicamentos.forEach((medicamento, index) => {
                const indicacion = data.indicaciones[index] || 'Sin indicación';
                doc.text(`- ${medicamento}`, margin + 5, y); y += lineHeight;
                doc.setFontSize(10);
                doc.text(`  Indicación: ${indicacion}`, margin + 5, y); y += lineHeight;
                doc.setFontSize(12);
            });
        
        } else if (formId === 'form-parte') {
            documentName = `Parte-${patient.replace(/\s/g, '_')}.pdf`;
            doc.text(`TIPO: Parte Médico`, margin, y); y += lineHeight;
            doc.text(`FECHA: ${data['paciente-fecha'] || 'N/A'}`, margin, y); y += lineHeight * 1.5;

            doc.text(`PACIENTE: ${patient}`, margin, y); y += lineHeight;
            doc.text(`DNI: ${data.paciente_dni || 'N/A'}`, margin, y); y += lineHeight;
            doc.text(`EDAD: ${data.paciente_edad || 'N/A'}`, margin, y); y += lineHeight * 1.5;
            
            doc.text(`DIAGNÓSTICO:`, margin, y); y += lineHeight;
            const diagnostico = doc.splitTextToSize(data.diagnostico || 'N/A', anchoMaximo);
            doc.text(diagnostico, margin + 5, y); y += (diagnostico.length * lineHeight);
            
            doc.text(`LICENCIA: ${data.dias_licencia || 'N/A'}`, margin, y); y += lineHeight;
        
        } else if (formId === 'form-orden') {
            documentName = `Orden-${patient.replace(/\s/g, '_')}.pdf`;
            doc.text(`TIPO: Orden Médica`, margin, y); y += lineHeight * 1.5;

            doc.text(`PACIENTE: ${patient}`, margin, y); y += lineHeight;
            doc.text(`DNI: ${data.paciente_dni || 'N/A'}`, margin, y); y += lineHeight;
            doc.text(`EDAD: ${data.paciente_edad || 'N/A'}`, margin, y); y += lineHeight;
            doc.text(`OBRA SOCIAL: ${data.paciente_os || 'N/A'}`, margin, y); y += lineHeight * 1.5;

            doc.text(`TIPO DE ESTUDIO: ${data.tipo_estudio || 'N/A'}`, margin, y); y += lineHeight * 1.5;
            
            doc.text(`DETALLES Y JUSTIFICACIÓN:`, margin, y); y += lineHeight;
            // La función 'splitTextToSize' corta el texto largo para que quepa en el ancho de la página
            const details = doc.splitTextToSize(data.detalles || 'Sin detalles', anchoMaximo); 
            doc.text(details, margin + 5, y);
            y += (details.length * lineHeight); // Aumenta 'y' por cada línea de detalle
        }
        
        // Firma del doctor (común a todos los documentos)
        y += lineHeight * 4; // Espacio antes de la firma
        doc.text("------------------------------------", margin, y); y += lineHeight;
        doc.text("Firma del Profesional:", margin, y); y += lineHeight;
        doc.text(data.doctor || 'Sin firma', margin, y);
        
        // 3. Guardar el PDF y forzar la descarga
        doc.save(documentName);
    }

    // --- (ELIMINADO) MANEJADOR DEL BOTÓN DE DESCARGA ---
    // ya no es necesario.
});