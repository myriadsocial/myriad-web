{{/*
Expand the name of the chart.
*/}}
{{- define "myriad-web.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "myriad-web.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "myriad-web.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "myriad-web.labels" -}}
helm.sh/chart: {{ include "myriad-web.chart" . }}
{{ include "myriad-web.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "myriad-web.selectorLabels" -}}
app.kubernetes.io/name: {{ include "myriad-web.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "myriad-web.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "myriad-web.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of firebase secret.
*/}}
{{- define "myriad-web.firebaseSecretName" -}}
{{- printf "%s-%s" (include "myriad-web.fullname" .) "firebase" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create the name of sentry secret.
*/}}
{{- define "myriad-web.sentrySecretName" -}}
{{- printf "%s-%s" (include "myriad-web.fullname" .) "sentry" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create the name of cloudinary secret.
*/}}
{{- define "myriad-web.cloudinarySecretName" -}}
{{- printf "%s-%s" (include "myriad-web.fullname" .) "cloudinary" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create the name of facebook secret.
*/}}
{{- define "myriad-web.facebookSecretName" -}}
{{- printf "%s-%s" (include "myriad-web.fullname" .) "facebook" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create the name of twitter secret.
*/}}
{{- define "myriad-web.twitterSecretName" -}}
{{- printf "%s-%s" (include "myriad-web.fullname" .) "twitter" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}
