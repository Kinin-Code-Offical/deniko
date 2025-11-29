import { getDictionary } from "@/lib/get-dictionary"
import { Locale } from "@/i18n-config"
import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage({
    params: { lang },
}: {
    params: { lang: Locale }
}) {
    const dictionary = await getDictionary(lang)

    return <LoginForm dictionary={dictionary} lang={lang} />
}
