import XLSX from 'xlsx'

let zel = {}
zel.excel_load = (buffer, call) => {
    var data = new Uint8Array(buffer);
    var workbook = XLSX.read(data, {type: 'array',cellDates: true});
    const book = []
    workbook.SheetNames.forEach(el=>{
        const sheet_list = XLSX.utils.sheet_to_json(workbook.Sheets[el], {header:1})
        book.push(sheet_list);
    })
    
    call(book)
}
export default zel