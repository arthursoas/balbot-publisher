export default interface Factory<T>
{
    /**
     * Create an empty instance of T
     */
    Create(...args: any) : T;
}