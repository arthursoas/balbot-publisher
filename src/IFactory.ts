export default interface Factory<T>
{
    /**
     * Create an instance of T with required params
     */
    Create(...args: any) : T;
}