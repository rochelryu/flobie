
export function className(arrayClass: string[]) {
    return arrayClass.join(' ');
}


export const level_role = (role: string) => {
    if(role.indexOf('EMPLOYER_') !== -1) {
      return 2;
    }
    else if(role.indexOf('ADMIN_') !== -1) {
      return 1;
    }
    else if(role.indexOf('SUPER_ADMIN') !== -1) {
      return 0;
    } else {
      return 3;
    } 
  }