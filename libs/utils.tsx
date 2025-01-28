export const phoneRegExp = /^\+[1-9]\d{1,14}$/;
export const passwordRegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\-_.])[\w\d!@#$%^&*\-_.]/;
export const nameRegExp = /^[^±!@£$%^&*_+§¡€#¢¶•ªº«\\/<>?:;|=.,0-9()]*$/;
export const tempEmail = /^[a-zA-Z-+]+(@gmail)$/;

export const isAdmin: () => boolean = () => {
  return true;
};

export const sanitizePhone = (phone) => {
  return phone;
};
