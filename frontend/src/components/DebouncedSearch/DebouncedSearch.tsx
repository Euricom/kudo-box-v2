import useDebounce from '../../hooks/useDebounce';
import Search from '../Search/Search';

interface Props {
    onDebounceComplete: (value: string) => void;
    onDebouncedCanceled: () => void;
    renderPreIcon?: () => JSX.Element;
}

const DebouncedSearch = ({ renderPreIcon, onDebounceComplete, onDebouncedCanceled }: Props) => {
    const { debouncedFn, cancelDebounce } = useDebounce(onDebounceComplete, 800);

    const handleChange = (inputText: string) => {
        if (!!inputText) return debouncedFn(inputText);
        cancelDebounce();
        onDebouncedCanceled();
    }

    return (
        <Search renderPreIcon={renderPreIcon} onChange={handleChange} />
    )
}

export default DebouncedSearch;