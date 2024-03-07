import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import { changePassWordByToken } from '../../../apis/userApi';
import InputPassword from '../../../components/InputPassword';
import Button from '../../../components/Button';
import { useState } from 'react';

interface IFormPassWord {
    currentPassWord: string;
    newPassWord: string;
    confirmPassWord: string;
}

const ManagerPass = () => {
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);

    const schema = yup.object().shape({
        currentPassWord: yup.string().required('Mật khẩu đang trống').min(8, 'Mật khẩu phải từ 8 kí tự trở lên'),
        newPassWord: yup
            .string()
            .required('Mật khẩu đang trống')
            .min(8, 'Mật khẩu phải từ 8 kí tự trở lên')
            .notOneOf([yup.ref('currentPassWord'), null], 'Mật khẩu mới không được trùng với mật khẩu hiện tại'),
        confirmPassWord: yup
            .string()
            .required('Mật khẩu đang trống')
            .min(8, 'Mật khẩu phải từ 8 kí tự trở lên')
            .oneOf([yup.ref('newPassWord')], 'Mật khẩu xác nhận phải giống với mật khẩu mới'),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormPassWord>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<IFormPassWord> = async (data) => {
        try {
            setLoadingAPI(true);
            const response = await changePassWordByToken(data.currentPassWord, data.newPassWord);
            setLoadingAPI(false);

            if (response.status === 200) {
                toast.success('Đổi thành công');
            } else {
                toast.error(response?.data.message || response?.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <section className="bg-white p-7 rounded-lg">
            <div className="h-full lg:w-9/12 xl:w-7/12 m-auto space-y-5">
                <div className="font-bold text-xl text-center">Đổi mật khẩu</div>
                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Controller
                            name="currentPassWord"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <InputPassword
                                    field={{ ...field }}
                                    error={errors.currentPassWord ? true : false}
                                    label={'Nhập mật khẩu cũ'}
                                />
                            )}
                        />
                        <p className="text-red-600 text-sm py-1 h-6">{errors.currentPassWord?.message}</p>
                    </div>
                    <div>
                        <Controller
                            name="newPassWord"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <InputPassword
                                    field={{ ...field }}
                                    error={errors.newPassWord ? true : false}
                                    label={'Nhập mật khẩu mới'}
                                />
                            )}
                        />
                        <p className="text-red-600 text-sm py-1 h-6">{errors.newPassWord?.message}</p>
                    </div>
                    <div>
                        <Controller
                            name="confirmPassWord"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <InputPassword
                                    field={{ ...field }}
                                    error={errors.confirmPassWord ? true : false}
                                    label={'Nhập lại mật khẩu mới'}
                                />
                            )}
                        />
                        <p className="text-red-600 text-sm py-1 h-6">{errors.confirmPassWord?.message}</p>
                    </div>
                    <Button type="submit" variant="fill" fullWidth loading={isLoadingAPI}>
                        Lưu mật khẩu mới
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default ManagerPass;
