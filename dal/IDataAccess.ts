export interface DataAccess<T> {
    add(t: T): Promise<void>,
    delete(id: number): Promise<void>,
    update(id: number, updateData: Partial<T>): Promise<void>,
    getItemByID(id: number): Promise<T>,
    getItems(): Promise<T[]>
}