---
#layout: home
title: "Account"
permalink: /kpaas/account/
author_profile: false
sidebar:
  nav: kpaas
last_modified_at: 2024-06-17
toc: true
toc_label: "Account"
#toc_icon: "cogs"
---

[Reference](https://github.com/K-PaaS/container-platform/blob/master/install-guide/portal/cp-portal-standalone-guide.md#4-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%ED%94%8C%EB%9E%AB%ED%8F%BC-%ED%8F%AC%ED%84%B8-%EC%A0%91%EC%86%8D){: .btn .btn--info}

- 도메인(k-paas.io)에 따라서 URI은 변경됨

|          | URI                | ID    | PW               | note               |
|----------|--------------------|-------|------------------|--------------------|
| Portal   | portal.k-pass.io   | admin | admin            | UI                 |
| Harbor   | harbor.k-pass.io   | admin | Harbor12345      | container registry |
| Keycloak | keycloak.k-paas.io | admin | admin            | auth(SSO)          |
| Vault    | vault.k-paas.io    | N/A   | file(unseal-key) | data secure        |