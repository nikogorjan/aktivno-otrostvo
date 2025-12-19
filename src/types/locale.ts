export type Locale = 'sl' | 'en'

export type LocaleParams = Promise<{ locale: Locale }>

export type LocalePageProps<T extends object = {}> = {
  params: Promise<{ locale: Locale } & T>
}