export interface IFactory<T>
{
    /**
     * Create an instance of T with required params
     */
    Create(...args: any): T;
}