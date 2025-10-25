import { Fragment } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import "./authPages.css";

const mapAlertType = (type?: string) => {
    switch (type) {
        case "success":
            return "auth-alert-success";
        case "warning":
            return "auth-alert-warning";
        case "error":
            return "auth-alert-error";
        case "info":
        default:
            return "auth-alert-info";
    }
};

const mapAlertHeading = (type?: string) => {
    switch (type) {
        case "success":
            return "Başarılı";
        case "warning":
            return "Uyarı";
        case "error":
            return "Hata";
        case "info":
        default:
            return "Bilgi";
    }
};

type LoginPageProps = PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>;

const LoginPage = (props: LoginPageProps) => {
    const { kcContext, i18n, Template, classes } = props;

    const { realm, url, login, message, auth, usernameHidden } = kcContext;

    const credentialId = auth?.selectedCredential;
    const usernameLabel = realm.loginWithEmailAllowed ? "Kullanıcı adı veya e-posta" : "Kullanıcı adı";
    const showRememberMe = realm.rememberMe && !usernameHidden;
    const forgotPasswordLink = realm.resetPasswordAllowed
        ? ((url as unknown as { loginResetPasswordUrl?: string }).loginResetPasswordUrl ??
            url.loginResetCredentialsUrl)
        : undefined;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            classes={classes}
            doUseDefaultCss={false}
            bodyClassName="modern-auth"
            displayMessage={false}
            displayInfo={false}
            headerNode={<Fragment />}
        >
            <div className="auth-shell">
                <div className="auth-card" role="form" aria-labelledby="kc-page-title">
                    <header>
                        <h2>Hoş geldiniz</h2>
                        <p className="auth-subtitle">
                            Hesabınıza giriş yaparak yönetim paneline erişin.
                        </p>
                    </header>

                    {message && (
                        <div className={`auth-alert ${mapAlertType(message.type)}`} role="alert">
                            <strong>{mapAlertHeading(message.type)}</strong>
                            <span>{message.summary}</span>
                        </div>
                    )}

                    <form
                        id="kc-form-login"
                        className="auth-form"
                        action={url.loginAction}
                        method="post"
                        noValidate
                    >
                        {credentialId !== undefined && (
                            <input type="hidden" name="credentialId" value={credentialId} />
                        )}

                        {realm.password && !usernameHidden && (
                            <div className="auth-field">
                                <label htmlFor="username">{usernameLabel}</label>
                                <input
                                    id="username"
                                    className="auth-input"
                                    name="username"
                                    type="text"
                                    autoFocus
                                    defaultValue={login.username ?? ""}
                                    autoComplete="username"
                                    placeholder="ornek@yildizskylab.com"
                                />
                            </div>
                        )}

                        {realm.password && (
                            <div className="auth-field">
                                <label htmlFor="password">Şifre</label>
                                <input
                                    id="password"
                                    className="auth-input"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Şifrenizi girin"
                                />
                            </div>
                        )}

                        <div className="auth-inline">
                            {showRememberMe && (
                                <label className="auth-remember" htmlFor="rememberMe">
                                    <input
                                        id="rememberMe"
                                        name="rememberMe"
                                        type="checkbox"
                                        defaultChecked={Boolean(login.rememberMe)}
                                    />
                                    <span>Beni hatırla</span>
                                </label>
                            )}
                            {realm.resetPasswordAllowed && forgotPasswordLink && (
                                <a className="auth-forgot-link" href={forgotPasswordLink}>
                                    Şifremi unuttum
                                </a>
                            )}
                        </div>

                        <button type="submit" className="auth-submit" name="login">
                            Giriş yap
                        </button>
                    </form>
                </div>
            </div>
        </Template>
    );
};

export default LoginPage;
