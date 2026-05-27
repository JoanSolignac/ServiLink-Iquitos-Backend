export class ProfileResponseDto {
  declare userId: string;
  declare firstName: string;
  declare lastName: string;
  declare birthDate: Date;
  declare profilePictureUrl: string | null;
  declare bio: string | null;
  declare phone: string | null;
  declare address: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}
