export const varNameToString = (somefancyvariable:any):string => Object.keys({somefancyvariable})[0]
export const slug = (text:string):string => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')      
    .replace(/-+$/, '');
}