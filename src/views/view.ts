export interface View {
    readonly element: View;
    update(state:any, ...props:any): void;
}
