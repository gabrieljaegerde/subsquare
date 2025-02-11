import styled from "styled-components";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Input from "next-common/components/input";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import useCountdown from "next-common/utils/hooks/useCountdown";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import NextHead from "next-common/components/nextHead";
import UserPolicy from "next-common/components/userPolicy";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import GhostButton from "next-common/components/buttons/ghostButton";
import useForm from "next-common/utils/hooks/useForm";
import BaseLayout from "next-common/components/layout/baseLayout";

const Wrapper = styled.div`
  padding: 32px 0 6px;
  min-height: calc(100vh - 64px - 26px - 26px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
`;

const ContentWrapper = styled.div`
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  box-shadow: ${(props) => props.theme.shadow100};
  border-radius: 6px;
  width: 400px;
  margin: 0 auto;
  padding: 48px;

  > :not(:first-child) {
    margin-top: 24px;
  }

  > button:last-child {
    margin-top: 12px;
  }

  @media screen and (max-width: 392px) {
    width: 100%;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  line-height: 20px;
  color: ${(props) => props.theme.textPrimary};
`;

const ButtonWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 12px;
  }
`;

const LinkWrapper = styled.div`
  color: ${(props) => props.theme.textSecondary};
  text-align: center;

  a {
    font-weight: bold;
    color: ${(props) => props.theme.primaryPurple500};
  }
`;

const InputWrapper = styled.div``;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
  line-height: 12px;
  color: ${(props) => props.theme.textPrimary};
  :not(:first-child) {
    margin-top: 16px;
  }
`;

const InfoWrapper = styled.div`
  padding: 12px 16px;
  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;
  line-height: 150%;
  color: ${(props) => props.theme.textSecondary};
`;

const Redirect = styled.div`
  text-align: center;
  color: ${(props) => props.theme.textSecondary};

  .sec {
    font-weight: bold;
    color: ${(props) => props.theme.primaryPurple500};
    margin-left: 8px;
  }
`;

const FormWrapper = styled.form`
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

export default withLoginUserRedux(({ loginUser }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(!!loginUser);
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [agreeError, setAgreeError] = useState();
  const isMounted = useIsMounted();
  const { countdown, counting: emailSent, startCountdown } = useCountdown(3);

  if (emailSent && countdown === 0) {
    router.replace("/login");
  }

  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      username: "",
      email: "",
      password: "",
    },
    async (formData) => {
      if (!checked) {
        setAgreeError("You must accept our terms");
        return;
      }
      setLoading(true);
      const res = await nextApi.post("auth/signup", formData);
      if (res.result) {
        if (isMounted.current) {
          setSuccess(true);
        }
        sendVerifyEmail();
      } else if (res.error) {
        if (isMounted.current) {
          setErrors(res.error);
        }
      }
      if (isMounted.current) {
        setLoading(false);
      }
    },
    () => setErrors(null)
  );
  const { username, email, password } = formData;

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const sendVerifyEmail = () => {
    nextApi
      .post("user/resendverifyemail")
      .then(({ result, error }) => {
        if (result) {
          if (isMounted.current) {
            startCountdown();
          }
          return;
        }
        if (isMounted.current) {
          showErrorToast(
            error?.message ?? "some error occured when sending an Email"
          );
        }
      })
      .catch((err) => {
        if (isMounted.current) {
          showErrorToast("some error occurred when sending an Email");
        }
      });
  };

  useEffect(() => {
    if (loginUser?.emailVerified) {
      showErrorToast("You have already verified email address.");
      return setTimeout(() => {
        // router.replace("/");
      }, 1000);
    }
  });

  return (
    <BaseLayout>
      <NextHead title={`Signup`} desc={`Signup`} />
      <Wrapper>
        {!success && (
          <ContentWrapper>
            <Title>Sign up</Title>
            <FormWrapper onSubmit={handleSubmit}>
              <InputWrapper>
                <Label>Username</Label>
                <Input
                  placeholder="Please fill your name"
                  name="username"
                  value={username}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  error={errors?.data?.username}
                />
                <Label>Email</Label>
                <Input
                  placeholder="Please fill email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  error={errors?.data?.email}
                />
                <Label>Password</Label>
                <Input
                  placeholder="Please fill password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  error={errors?.data?.password}
                />
                {errors?.message && !errors?.data && (
                  <ErrorText>{errors?.message}</ErrorText>
                )}
              </InputWrapper>
              <UserPolicy
                checked={checked}
                setChecked={setChecked}
                agreeError={agreeError}
                setAgreeError={setAgreeError}
              />
              <ButtonWrapper>
                <SecondaryButton isFill type="submit" isLoading={loading}>
                  Sign up
                </SecondaryButton>
              </ButtonWrapper>
            </FormWrapper>
            <LinkWrapper>
              Already have a account? <Link href="/login">Login</Link>
            </LinkWrapper>
          </ContentWrapper>
        )}
        {success && (
          <ContentWrapper>
            <Title>{emailSent ? "Congrats." : "Sending..."}</Title>
            <InfoWrapper>
              {emailSent
                ? "We sent you an email to verify your address. Click on the link in the email."
                : "Sending an email to verify your address."}
            </InfoWrapper>
            <SecondaryButton
              isFill
              secondary
              onClick={() => router.replace("/")}
            >
              Got it
            </SecondaryButton>
            <GhostButton isFill onClick={sendVerifyEmail}>
              Resend
            </GhostButton>
            {emailSent && (
              <Redirect>
                The page will be re-directed in
                <span className="sec">{countdown}s</span>
              </Redirect>
            )}
          </ContentWrapper>
        )}
      </Wrapper>
    </BaseLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
