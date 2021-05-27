import useDebounce from '../../hooks/useDebounce';
import IconInput from '../IconInput/IconInput';

interface Props {
    onDebounceComplete: (value: string) => void;
    onDebouncedCanceled: () => void;
    renderPreIcon?: () => JSX.Element;
}

const DebouncedIconInput = ({ renderPreIcon, onDebounceComplete, onDebouncedCanceled }: Props) => {
    const { debouncedFn, cancelDebounce } = useDebounce(onDebounceComplete, 800);

    const handleChange = (inputText: string) => {
        if (!!inputText) return debouncedFn(inputText);
        cancelDebounce();
        onDebouncedCanceled();
    }

    return (
        <IconInput renderPreIcon={renderPreIcon} onChange={handleChange} />
    )
}

export default DebouncedIconInput;