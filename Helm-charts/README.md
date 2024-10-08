# helm-charts

Helm charts repo to simplify and standardise the daily deployments of my personal and POC projects.

## Usage

### Helm
```shell
helm repo add andytang https://andytang-dev.github.io/helm-charts
```

### Helmfile
```yaml
repositories:
- name: andytang
  url: https://andytang-dev.github.io/helm-charts
```

### Debug
```bash
$ helm template --debug .
```