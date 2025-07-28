import { useForm } from 'react-hook-form'
import Button from '../../ui/Button'
import Form from '../../ui/Form'
import FormRow from '../../ui/FormRow'
import Input from '../../ui/Input'
import { useSignup } from './useSignup'
import Spinner from '../../ui/Spinner'
import SpinnerMini from '../../ui/SpinnerMini'

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
    const { register, formState, handleSubmit, getValues, reset } = useForm()
    const { errors } = formState
    const { signUp, isLoading } = useSignup() || {}// useSignup() || {}
    if (isLoading) return <Spinner />
    function onSubmit(data) {
        signUp({
            fullName: data.fullName,
            email: data.email,
            password: data.password,
            avatar: data.avatar
        }, {
            onSettled: () => {
                reset()
            }
        })
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow label='Full name' error={errors?.fullName?.message}>
                <Input
                    type='text'
                    id='fullName'
                    disabled={isLoading}
                    {...register('fullName', { required: 'This field is required' })}
                />
            </FormRow>

            <FormRow label='Email address' error={errors?.email?.message}>
                <Input
                    type='email'
                    id='email'
                    disabled={isLoading}
                    {...register('email', {
                        required: 'This field is required',
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Please provide a valid email address'
                        }
                    })}
                />
            </FormRow>

            <FormRow
                label='Password (min 8 characters)'
                error={errors?.password?.message}
            >
                <Input
                    type='password'
                    id='password'
                    disabled={isLoading}
                    {...register('password', {
                        required: 'This field is required',
                        minLength: {
                            value: 8,
                            message: 'Password needs a minimum of 8 characters'
                        }
                    })}
                />
            </FormRow>

            <FormRow label='Repeat password' error={errors?.passwordConfirm?.message}>
                <Input
                    type='password'
                    id='passwordConfirm'
                    disabled={isLoading}
                    {...register('passwordConfirm', {
                        required: 'This field is required',
                        validate: value =>
                            value === getValues().password || 'Passwords need to match'
                    })}
                />
            </FormRow>

            <FormRow>
                {/* type is an HTML attribute! */}
                <Button variation='secondary' type='reset' size='medium'>
                    Cancel
                </Button>
                <Button variation='primary' size='medium' type='submit'>
                  {!isLoading ?  "Create new user" : <SpinnerMini/>}
                </Button>
            </FormRow>
        </Form>
    )
}

export default SignupForm
