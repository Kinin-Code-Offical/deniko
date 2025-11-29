import { getDictionary } from "@/lib/get-dictionary"
import { Locale } from "@/i18n-config"
import { RegisterForm } from "@/components/auth/register-form"

export default async function RegisterPage({
    params: { lang },
}: {
    params: { lang: Locale }
}) {
    const dictionary = await getDictionary(lang)

    return <RegisterForm dictionary={dictionary} lang={lang} />
}
