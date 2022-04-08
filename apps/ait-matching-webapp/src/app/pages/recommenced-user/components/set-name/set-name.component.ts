import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ait-set-name',
  templateUrl: './set-name.component.html',
  styleUrls: ['./set-name.component.scss']
})
export class SetNameComponent {
  nameForm: FormGroup;
  isSubmit = false;
  constructor(
    private nbDialogRef: NbDialogRef<SetNameComponent>,
    private formBuilder: FormBuilder,
  ) {
    this.nameForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
    });
  }

  close(event: boolean) {
    if (event) {
      this.isSubmit = true;
      if (this.nameForm.valid) {
        const name = this.nameForm.controls['name'].value;
        this.nbDialogRef.close(name);
      }
    } else {
      this.nbDialogRef.close('');
    }
  }

  takeInputValue(value: string): void {
    if (value) {
      this.nameForm.controls['name'].markAsDirty();
      this.nameForm.controls['name'].setValue(value);
    } else {
      this.nameForm.controls['name'].setValue(null);
    }
  }
}
