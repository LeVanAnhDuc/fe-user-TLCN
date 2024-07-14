// components
import Loading from '../Loading';

const PageLoading = () => {
    return (
        <div className="fixed h-screen w-screen bg-black/10 z-50 dark:bg-gray-400/30">
            <Loading />
        </div>
    );
};

export default PageLoading;
