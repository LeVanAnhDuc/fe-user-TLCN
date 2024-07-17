import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Iprops {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    className?: string;
    error?: boolean;
}

const TextEditer = (props: Iprops) => {
    const { value, setValue, className, error } = props;

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ font: [] }],
            [{ size: ['small', false, 'large', 'huge'] }],

            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],

            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
            [{ indent: '-1' }, { indent: '+1' }, { align: [] }],

            ['link', 'image', 'video', 'formula'],

            [{ header: 1 }, { header: 2 }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ direction: 'rtl' }],

            [{ color: [] }, { background: [] }],

            ['clean'],
        ],
    };

    const classError = error && '!border-red-400 border-2';

    return (
        <>
            <ReactQuill
                className={`${className} ${classError} bg-gray-100`}
                theme="snow"
                modules={modules}
                value={value}
                onChange={setValue}
            />
        </>
    );
};

export default TextEditer;
