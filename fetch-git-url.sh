curl --header "PRIVATE-TOKEN:replace_your_gitlab_token" "replace_your_company_gitlab_site/api/v4/groups/replace_target_repository_group_id/projects?per_page=100&page=1"  | jq "map({description, http_url_to_repo})" > repositories.json


记住， 有的 要用ssh_url_to_repo