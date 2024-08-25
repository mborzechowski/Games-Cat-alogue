import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    _id: ObjectId,
    username: string,  // Nazwa użytkownika
    email: string,  // Email użytkownika
    password_hash: string,  // Zahashowane hasło
    date_created: date,  // Data założenia konta
    games_owned: [ObjectId],  // Lista ID gier posiadanych przez użytkownika
    games_wishlist: [ObjectId],  // Lista ID gier na liście życzeń
    settings: {  // Ustawienia użytkownika
        theme: string,  // Motyw graficzny (np. light, dark)
        notifications_enabled: boolean  // Czy powiadomienia są włączone
    }
});


export default mongoose.models.User || mongoose.model('User', UserSchema);