export const setCookie = (name, value, days) => {
  let cookieString = name + "=" + (value || "");
  
  // Eğer days belirtilmişse (ve 0'dan büyükse), kalıcı cookie oluştur
  if (days && days > 0) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    cookieString += "; expires=" + date.toUTCString();
  }
  // days belirtilmemişse veya null/undefined ise, session cookie olur (expires yok)
  
  cookieString += "; path=/; SameSite=Strict";
  document.cookie = cookieString;
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
