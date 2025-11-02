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

// (NUEVO) Variables para guardar las imágenes en formato Base64
let logoImgData = '';
let firmaImgData = '';

// (NUEVO) Función para convertir imágenes a Base64
function loadImageAsBase64(url, callback) {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Necesario si las imágenes estuvieran en otro servidor
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        callback(dataURL);
    };
    img.src = url;
}

// (NUEVO) Esperamos a que la página (incluidas las imágenes) se cargue
window.onload = () => {
    const logoImgElement = document.getElementById('logo-img');
    const firmaImgElement = document.getElementById('firma-img');

    if (logoImgElement && firmaImgElement) {
        loadImageAsBase64(logoImgElement.src, (data) => {
            logoImgData = data;
            console.log('Logo cargado en Base64.');
        });
        loadImageAsBase64(firmaImgElement.src, (data) => {
            firmaImgData = data;
            console.log('Firma cargada en Base64.');
        });
    } else {
        console.error("No se encontraron los elementos <img> de precarga.");
    }
};


document.addEventListener('DOMContentLoaded', () => {
    // --- IMPORTAR LIBRERÍA ---
    const { jsPDF } = window.jspdf;

    // --- ELEMENTOS DEL DOM ---
    const selector = document.getElementById('document-type');
    const formContainer = document.getElementById('form-container');
    const formTitle = document.getElementById('form-title');
    const addMedBtn = document.getElementById('add-medicamento-btn');
    const medicamentosList = document.getElementById('medicamentos-list');
    const doctorDropdowns = document.querySelectorAll('.doctor-select');

    const forms = {
        receta: document.getElementById('form-receta'),
        parte: document.getElementById('form-parte'),
        orden: document.getElementById('form-orden')
    };

    // --- FUNCIÓN PARA POBLAR LOS MENÚS DE DOCTORES ---
    function populateDoctorDropdowns() {
        doctorDropdowns.forEach(dropdown => {
            while (dropdown.options.length > 1) {
                dropdown.remove(1);
            }
            medicos.forEach(medico => {
                const option = document.createElement('option');
                // (MODIFICADO) Usamos '|' para poder parsear los datos fácilmente
                option.value = `${medico.nombre}|${medico.especializacion}|${medico.matricula}`;
                option.textContent = `${medico.nombre} (${medico.especializacion})`;
                dropdown.appendChild(option);
            });
        });
    }
    populateDoctorDropdowns();

    // --- MANEJADOR DEL MENÚ PRINCIPAL ---
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

    // --- FUNCIÓN PARA REINICIAR LA INTERFAZ ---
    const resetUI = () => {
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

    // --- (MODIFICADO) MANEJO DEL ENVÍO DE FORMULARIOS ---
    Object.values(forms).forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            
            // Usamos Object.fromEntries para capturar TODOS los campos fácilmente
            let data = Object.fromEntries(formData.entries());
            
            // Parsear datos del doctor
            const [nombreDoctor, especializacionDoctor, matriculaDoctor] = data.doctor_seleccionado.split('|');
            data.doctor = {
                nombre: nombreDoctor,
                especializacion: especializacionDoctor,
                matricula: matriculaDoctor
            };

            // Casos especiales (campos múltiples)
            if (form.id === 'form-receta') {
                data.medicamentos = formData.getAll('medicamento[]');
                data.indicaciones = formData.getAll('indicacion[]');
            }

            // 1. Genera el PDF y dispara la descarga
            generateCertificatePdf(form.id, data);

            // 2. Resetea la UI para volver al inicio
            resetUI();
        });
    });
    
    // --- (NUEVA FUNCIÓN) GENERACIÓN DE PDF PROFESIONAL ---
    function generateCertificatePdf(formId, data) {
        
        const doc = new jsPDF('p', 'mm', 'a4'); // 'p' (portrait), 'mm' (milímetros), 'a4' (tamaño)
        
        // --- VARIABLES DE DISEÑO ---
        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - (margin * 2);
        const lineHeight = 7;
        let y = margin + 10; // Posición Y inicial

        // --- 1. ENCABEZADO (Logo y Datos del Doctor) ---
        if (logoImgData) {
            doc.addImage(logoImgData, 'PNG', margin, y, 30, 30); // Logo (30x30 mm)
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(data.doctor.nombre, pageWidth / 2, y + 5, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(data.doctor.especializacion, pageWidth / 2, y + 12, { align: 'center' });
        doc.text(data.doctor.matricula, pageWidth / 2, y + 19, { align: 'center' });
        
        y += 40; // Moverse hacia abajo después del encabezado

        // --- TÍTULO DEL DOCUMENTO ---
        let docTitle = '';
        let documentName = '';
        
        if (formId === 'form-receta') {
            docTitle = 'RECETA MÉDICA';
            documentName = `Receta-${(data.paciente || '').replace(/\s/g, '_')}.pdf`;
        } else if (formId === 'form-parte') {
            docTitle = 'PARTE MÉDICO';
            documentName = `Parte-${(data.paciente || '').replace(/\s/g, '_')}.pdf`;
        } else if (formId === 'form-orden') {
            docTitle = 'ORDEN MÉDICA';
            documentName = `Orden-${(data.paciente || '').replace(/\s/g, '_')}.pdf`;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(docTitle, pageWidth / 2, y, { align: 'center' });
        
        y += 15;

        // --- 2. DATOS DEL PACIENTE (¡INCLUIMOS TODO!) ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('DATOS DEL PACIENTE', margin, y);
        doc.line(margin, y + 2, margin + contentWidth, y + 2); // Línea divisoria
        y += (lineHeight * 1.5);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        
        // Función para añadir campos en dos columnas
        const addPatientData = (label, value) => {
            if (value) { // Solo añade el campo si tiene un valor
                doc.setFont('helvetica', 'bold');
                doc.text(label, margin, y);
                doc.setFont('helvetica', 'normal');
                doc.text(value, margin + 40, y); // 40mm para la etiqueta
                y += lineHeight;
            }
        };

        addPatientData('Nombre:', data.paciente);
        addPatientData('DNI:', data.paciente_dni);
        addPatientData('Edad:', data.paciente_edad);
        addPatientData('Sexo:', data.paciente_sexo);
        addPatientData('Obra Social:', data.paciente_os);
        
        let fecha = data.paciente_fecha ? new Date(data.paciente_fecha).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES');
        addPatientData('Fecha:', fecha);

        // --- 3. CUERPO DEL DOCUMENTO (Contenido específico) ---
        
        // Función de ayuda para secciones de texto largo
        const addSection = (title, text) => {
            y += (lineHeight * 2);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text(title, margin, y);
            doc.line(margin, y + 2, margin + contentWidth, y + 2);
            y += (lineHeight * 1.5);
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            
            // 'splitTextToSize' divide el texto largo para que quepa en el ancho
            const splitText = doc.splitTextToSize(text || 'N/A', contentWidth);
            doc.text(splitText, margin, y);
            y += (splitText.length * lineHeight); // Mover 'y' según cuántas líneas ocupe el texto
        };

        if (formId === 'form-receta') {
            y += (lineHeight * 2);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text('MEDICAMENTOS', margin, y);
            doc.line(margin, y + 2, margin + contentWidth, y + 2);
            y += (lineHeight * 1.5);
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            
            data.medicamentos.forEach((med, index) => {
                doc.setFont('helvetica', 'bold');
                doc.text(`- ${med}`, margin, y);
                y += lineHeight;
                
                doc.setFont('helvetica', 'normal');
                const indicacion = data.indicaciones[index] || 'Sin indicación';
                const splitIndicacion = doc.splitTextToSize(`  Indicación: ${indicacion}`, contentWidth - 5);
                doc.text(splitIndicacion, margin, y);
                y += (splitIndicacion.length * lineHeight) + 3; // Espacio extra
            });

        } else if (formId === 'form-parte') {
            addSection('DIAGNÓSTICO', data.diagnostico);
            addSection('DÍAS DE LICENCIA', data.dias_licencia);

        } else if (formId === 'form-orden') {
            addSection('TIPO DE ESTUDIO', data.tipo_estudio);
            addSection('DETALLES Y JUSTIFICACIÓN', data.detalles);
        }

        // --- 4. PIE DE PÁGINA (Firma) ---
        const firmaY = 250; // Posición Y fija cerca del final de la página (A4 es 297mm)
        const firmaAncho = 50;
        const firmaAlto = 25;
        
        if (firmaImgData) {
            // Centrar la firma
            const firmaX = (pageWidth - firmaAncho) / 2;
            doc.addImage(firmaImgData, 'PNG', firmaX, firmaY, firmaAncho, firmaAlto);
        }
        
        // Línea de firma
        doc.line(margin + 40, firmaY + firmaAlto + 2, pageWidth - margin - 40, firmaY + firmaAlto + 2);
        
        // Texto de firma
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(data.doctor.nombre, pageWidth / 2, firmaY + firmaAlto + 8, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.text(data.doctor.matricula, pageWidth / 2, firmaY + firmaAlto + 13, { align: 'center' });


        // --- 5. GUARDAR ---
        doc.save(documentName);
    }
});