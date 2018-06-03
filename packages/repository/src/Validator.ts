interface Validator<T> {
    validate: (item: T) => void;
    validateMany?: (items: T[]) => void;
}