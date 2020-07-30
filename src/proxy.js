

export function dataProxy (data) {
    const  {
        lines,
        modules,
        results,
        resultLines
    } = data;

}
export function proxyResults(data) {
    Object.defineProperty(data, 'results', {
        set(newValue) {

        }
    })
}