import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,  // This indicates it's a standalone component
  imports: [CommonModule, ReactiveFormsModule]  // Ensure necessary modules are imported
})
export class AppComponent implements OnInit {
  findReplaceForm!: FormGroup;
  message: string | null = null;
  messageType: 'success' | 'error' | 'info' | null = null;
  loading: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.findReplaceForm = this.fb.group({
      textInput: ['', [Validators.required]],
      findText: ['', [Validators.required]],
      replaceText: [''],
    });
  }

  replaceTextFunction() {
    this.loading = true;
    const { textInput, findText, replaceText } = this.findReplaceForm.value;
  
    // Check if the findText is in the textInput
    if (!textInput.includes(findText)) {
      this.message = `The text "${findText}" was not found in the input.`;
      this.messageType = 'error';
      this.loading = false;
      setTimeout(() => this.clearMessage(), 2000);  // Clear message after 2 seconds
      return;
    }
  
    if (!replaceText) {
      const userConfirmed = window.confirm('The "Replace with" field is empty. Do you want to proceed and remove all occurrences of the find text?');
      if (!userConfirmed) {
        this.message = 'Replacement operation canceled.';
        this.messageType = 'info';
        this.loading = false;
        setTimeout(() => this.clearMessage(), 2000);  // Clear message after 2 seconds
        return;
      }
    }
  
    // Proceed with replacement
    const regex = new RegExp(findText, 'g');
    const newText = textInput.replace(regex, replaceText);
  
    if (textInput === newText) {
      this.message = `No occurrences of "${findText}" found.`;
      this.messageType = 'info';
    } else {
      this.findReplaceForm.patchValue({ textInput: newText });
      this.message = `All occurrences of "${findText}" replaced with "${replaceText}".`;
      this.messageType = 'success';
    }
  
    this.loading = false;
    setTimeout(() => this.clearMessage(), 3000);  // Clear message after 2 seconds
  }
  
  // Function to clear message after timeout
  clearMessage() {
    this.message = null;
    this.messageType = null;
  }
  
  clearForm() {
    this.findReplaceForm.reset();
    this.message = null;
    this.messageType = null;
  }
}
