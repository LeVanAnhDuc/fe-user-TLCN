import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';

interface Iprops {
    content?: string;
    open: boolean;
}

const SnackBarLoading = (props: Iprops) => {
    const { content = 'Đợi giây lát !!', open } = props;

    return (
        <>
            <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={Slide}>
                <div className="flex items-center gap-2 px-8 py-3 bg-primary-300  rounded-xl dark:bg-dark-400">
                    <CircularProgress
                        variant="indeterminate"
                        size={30}
                        className="!text-primary-900 dark:!text-primary-300"
                    />
                    {content}
                </div>
            </Snackbar>
        </>
    );
};

export default SnackBarLoading;
