import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema: Schema<IUser> = new Schema({

    name: {
        type: String,
        required: [true, 'El campo nombre es obligatorio']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El campo email es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    age: {
        type: Number,
        required: [true, 'El campo edad es obligatorio']
    },
    size: {
        type: String,
        required: [true, 'El campo tamaño es obligatorio']
    },
    sex: {
        type: String,
        required: [true, 'El campo sexo es obligatorio']
    },
    desc: {
        type: String
    },

});

userSchema.method('pwdCompare', function (password: string = ''): boolean {
    if (bcrypt.compareSync(password, this.password)) {
        return true;
    } else {
        return false;
    }
});



interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    img: string;
    age: number;
    size: string;
    sex: string;
    desc: string;

    pwdCompare(password: string): boolean;
}


export const User = model<IUser>('User', userSchema);