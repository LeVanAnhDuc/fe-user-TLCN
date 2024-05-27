import { useForm, SubmitHandler } from 'react-hook-form';

import Button from '@mui/material/Button';

import InputText from '../../../components/InputText/InputText';
import { toast } from 'react-toastify';
import { changePassWordByToken } from '../../../apis/userApi';

interface IFormPassWord {
    currentPassWord: string;
    newPassWord: string;
    confirmPassWord: string;
}

const ManagerPass = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormPassWord>({
        defaultValues: {
            currentPassWord: '',
            newPassWord: '',
            confirmPassWord: '',
        },
    });
    // submit form

    const onSubmit: SubmitHandler<IFormPassWord> = async (data) => {
        // kiem tra mat hien tai  => true

        if (data.newPassWord !== data.confirmPassWord) {
            toast.error('Mật khẩu mới không khớp với nhau');
        } else if (data.currentPassWord === data.newPassWord) {
            toast.error('Mật khẩu mới trùng mật khẩu hiện tại');
        } else {
            //
            //  call api doi mk
            const response = await changePassWordByToken(data.currentPassWord, data.newPassWord);
            if (response.status === 200) {
                toast.success(response?.data);
            } else {
                toast.error(response?.data.message || response?.data);
            }
        }
    };

    return (
        <>
            {/* start section 2 */}
            <div className="py-10 h-full w-full sm:w-7/12 m-auto text-center ">
                <div className="mb-5 font-semibold text-xl">Đổi mật khẩu</div>
                <form className="space-y-6 mb-10" onSubmit={handleSubmit(onSubmit)}>
                    {/* start input password */}
                    <InputText
                        labelInput="Mật khẩu hiện tại"
                        errorInput={errors.currentPassWord ? true : false}
                        isRequired
                        typeInput="password"
                        errorFormMessage={errors.currentPassWord?.message}
                        register={{
                            ...register('currentPassWord', {
                                required: 'CurrentPassWord is required',
                            }),
                        }}
                    />
                    {/* end input password */}
                    {/* start new password */}
                    <InputText
                        labelInput="Mật khẩu mới"
                        errorInput={errors.newPassWord ? true : false}
                        isRequired
                        typeInput="password"
                        errorFormMessage={errors.newPassWord?.message}
                        register={{
                            ...register('newPassWord', {
                                required: 'NewPassWord is required',
                            }),
                        }}
                    />
                    {/* end new password */}
                    {/* start comfirm password */}
                    <InputText
                        labelInput="Xác nhận lại mật khẩu"
                        errorInput={errors.confirmPassWord ? true : false}
                        isRequired
                        typeInput="password"
                        errorFormMessage={errors.confirmPassWord?.message}
                        register={{
                            ...register('confirmPassWord', {
                                required: 'Confirm PassWord is required',
                            }),
                        }}
                    />
                    {/* end comfirm password */}
                    <Button
                        style={{ float: 'right'}}
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                    >
                        Lưu
                    </Button>
                </form>
            </div>

            {/* end section 2 */}
        </>
    );
};

export default ManagerPass;
