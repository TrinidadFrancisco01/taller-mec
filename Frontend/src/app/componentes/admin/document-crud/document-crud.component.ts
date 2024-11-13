import { Component, signal, WritableSignal } from '@angular/core';
import { AuthService } from './auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importar los módulos
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-document-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './document-crud.component.html',
  styles: ``
})
export class DocumentCrudComponent {
  documentTypes = ['Política de privacidad', 'Términos y condiciones', 'Deslinde legal'];
  selectedType = signal<string>('Políticas de Privacidad'); // Valor inicial por defecto
  documents = signal<any[]>([]);
  newDocument: WritableSignal<any> = signal({
    title: '',
    description: '',
    expirationDate: ''
  });

    // Nuevas propiedades para el modal
    isModalOpen = signal<boolean>(false);
    editingDocument: WritableSignal<any> = signal({
      _id: '',
      title: '',
      description: '',
      documentType: '',
      expirationDate: '',
      estado: ''
    });
  

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadDocuments();
  }

  get selectedTypeValue() {
    return this.selectedType();
  }

  set selectedTypeValue(value: string) {
    this.selectedType.set(value);
    this.loadDocuments();
  }

  loadDocuments() {
    this.authService.getAllDocuments().subscribe({
        next: (data) => this.documents.set(data),
        error: (err) => console.error('Error al obtener documentos', err)
    });
  }

  createNewDocument() {
    
    const document = { 
        title: this.newDocument().title, 
        description: this.newDocument().description,
        expirationDate: this.newDocument().expirationDate,
        documentType: this.selectedType(), // Valor del combobox
        estado: 'vigente' 
    };
  
    console.log('Documento a crear:', document); // Para depurar
  
    this.authService.createDocument(document).subscribe({
        next: (newDoc) => {
            this.documents.set([newDoc, ...this.documents()]);
            this.resetForm();
        },
        error: (err) => console.error('Error al crear el documento', err)
    });
  }
    // Nuevos métodos para el modal
    openUpdateModal(document: any) {
      this.editingDocument.set({
        documentId: document._id,  // Asegúrate de usar el campo correcto
        title: document.title,
        description: document.description,
        documentType: document.documentType,
        expirationDate: document.expirationDate.split('T')[0], // Convertir la fecha para el input
        estado: document.estado
      });
      this.isModalOpen.set(true);
    }
    

    closeModal() {
      this.isModalOpen.set(false);
      this.editingDocument.set({
        _id: '',
        title: '',
        description: '',
        documentType: '',
        expirationDate: '',
        estado: ''
      });
    }

    updateDocument() {
      const updatedDoc = this.editingDocument();
      
      // Asegúrate de que el documentId esté presente
      if (!updatedDoc.documentId) {
         console.error('Falta el documentId. No se puede actualizar el documento.');
         return;
      }
   
      this.authService.updateDocument(updatedDoc).subscribe({
         next: () => {
            this.loadDocuments(); // Recargar la lista después de actualizar
            this.closeModal();
         },
         error: (err) => console.error('Error al actualizar el documento', err)
      });
   }
   
  
  
  resetForm() {
    this.newDocument.set({ title: '', description: '', expirationDate: '' });
  }

  trackById(index: number, doc: any): string {
    return doc._id;
  }
}