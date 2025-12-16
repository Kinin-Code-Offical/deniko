# index.ts

**Path**: `packages\db\src\index.ts`

## createDb

**Type**: `VariableDeclaration`

## PrismaPromise

**Type**: `TypeAliasDeclaration`

## User

**Type**: `TypeAliasDeclaration`

Model User
Sisteme giriş yapan gerçek kişi (Öğretmen veya Öğrenci olabilir).

## UserSettings

**Type**: `TypeAliasDeclaration`

Model UserSettings
Kullanıcı gizlilik ve tercih ayarları.

## Account

**Type**: `TypeAliasDeclaration`

Model Account
OAuth hesapları (Google, Apple vb. ile giriş için).

## Session

**Type**: `TypeAliasDeclaration`

Model Session
Oturum yönetimi.

## VerificationToken

**Type**: `TypeAliasDeclaration`

Model VerificationToken
E-posta doğrulama tokenları.

## PasswordResetToken

**Type**: `TypeAliasDeclaration`

Model PasswordResetToken
Şifre sıfırlama tokenları.

## EmailChangeRequest

**Type**: `TypeAliasDeclaration`

Model EmailChangeRequest
E-posta değişikliği istekleri.

## Device

**Type**: `TypeAliasDeclaration`

Model Device
Kullanıcının giriş yaptığı cihazlar (Bildirim göndermek için).

## TeacherProfile

**Type**: `TypeAliasDeclaration`

Model TeacherProfile
Öğretmen profili. Dersler, sınıflar ve finansal veriler buraya bağlıdır.

## StudentProfile

**Type**: `TypeAliasDeclaration`

Model StudentProfile
Öğrenci profili. Hem gerçek kullanıcılar hem de "Gölge Hesaplar" (User'ı olmayan) için kullanılır.

## StudentTeacherRelation

**Type**: `TypeAliasDeclaration`

Model StudentTeacherRelation
Öğretmen ve Öğrenci arasındaki bağlantı tablosu (Many-to-Many).
Öğretmen, öğrenciyi kendi listesinde nasıl görüyor?

## Classroom

**Type**: `TypeAliasDeclaration`

Model Classroom
Sınıf veya Grup (Örn: "12-A", "LGS Grubu").

## ScheduleItem

**Type**: `TypeAliasDeclaration`

Model ScheduleItem
📅 DERS PROGRAMI ŞABLONU (Recurring Schedule)
"Her Pazartesi 09:00'da Matematik var" kuralını tutar.

## Lesson

**Type**: `TypeAliasDeclaration`

Model Lesson
📆 GERÇEKLEŞEN DERS (Event)
Takvimde görünen, yoklaması alınan somut ders kaydı.

## Material

**Type**: `TypeAliasDeclaration`

Model Material
Derse eklenen dosya veya linkler.

## Homework

**Type**: `TypeAliasDeclaration`

Model Homework
Verilen Ödev (Ana Başlık).

## HomeworkTracking

**Type**: `TypeAliasDeclaration`

Model HomeworkTracking
Ödev Takibi (Öğrenci bazlı durum).
Öğretmenin "Yaptı/Yapmadı" işaretlediği yer.

## HomeworkSubmission

**Type**: `TypeAliasDeclaration`

Model HomeworkSubmission
Öğrencinin ödev teslimi (Gelişmiş kullanım).

## SchoolExam

**Type**: `TypeAliasDeclaration`

Model SchoolExam
Okul Sınav Sonuçları (Yazılılar).

## TrialExam

**Type**: `TypeAliasDeclaration`

Model TrialExam
Deneme Sınavı (Ana Kayıt).

## TrialExamResult

**Type**: `TypeAliasDeclaration`

Model TrialExamResult
Deneme Sınavı Detayları (Ders bazlı netler).

## Attendance

**Type**: `TypeAliasDeclaration`

Model Attendance
Yoklama Kaydı.

## Payment

**Type**: `TypeAliasDeclaration`

Model Payment
Ödeme Kayıtları.

## Todo

**Type**: `TypeAliasDeclaration`

Model Todo
Yapılacaklar Listesi.

## Event

**Type**: `TypeAliasDeclaration`

Model Event
Genel Takvim Etkinliği (Ders dışı olaylar).

## Message

**Type**: `TypeAliasDeclaration`

Model Message
Kullanıcılar arası mesajlaşma.

## Notification

**Type**: `TypeAliasDeclaration`

Model Notification
Sistem Bildirimleri.

## File

**Type**: `TypeAliasDeclaration`

Model File

## $Enums

**Type**: `ModuleDeclaration`

Enums

## Role

**Type**: `TypeAliasDeclaration`

## Role

**Type**: `VariableDeclaration`

## DeviceType

**Type**: `TypeAliasDeclaration`

## DeviceType

**Type**: `VariableDeclaration`

## RelationStatus

**Type**: `TypeAliasDeclaration`

## RelationStatus

**Type**: `VariableDeclaration`

## LessonType

**Type**: `TypeAliasDeclaration`

## LessonType

**Type**: `VariableDeclaration`

## LessonStatus

**Type**: `TypeAliasDeclaration`

## LessonStatus

**Type**: `VariableDeclaration`

## LessonLocation

**Type**: `TypeAliasDeclaration`

## LessonLocation

**Type**: `VariableDeclaration`

## PaymentType

**Type**: `TypeAliasDeclaration`

## PaymentType

**Type**: `VariableDeclaration`

## HomeworkStatus

**Type**: `TypeAliasDeclaration`

## HomeworkStatus

**Type**: `VariableDeclaration`

## ExamCategory

**Type**: `TypeAliasDeclaration`

## ExamCategory

**Type**: `VariableDeclaration`

## AttendanceStatus

**Type**: `TypeAliasDeclaration`

## AttendanceStatus

**Type**: `VariableDeclaration`

## Priority

**Type**: `TypeAliasDeclaration`

## Priority

**Type**: `VariableDeclaration`

## NotificationType

**Type**: `TypeAliasDeclaration`

## NotificationType

**Type**: `VariableDeclaration`

## FileType

**Type**: `TypeAliasDeclaration`

## FileType

**Type**: `VariableDeclaration`

## PrismaClient

**Type**: `ClassDeclaration`

##  Prisma Client ʲˢ

Type-safe database client for TypeScript & Node.js

## Prisma

**Type**: `ModuleDeclaration`

