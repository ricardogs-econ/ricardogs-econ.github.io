---
layout: page
permalink: /codes/
title: codes
description: Research code and software repositories.
nav: true
nav_order: 3
---

{% if site.data.repositories.codes %}
<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-stretch">
  {% for repo in site.data.repositories.codes %}
    <div class="repo p-2" style="width: 100%; max-width: 300px;">
      <div class="card h-100 p-3">
        <h5 class="card-title font-weight-bold">{{ repo.name }}</h5>
        <h6 class="card-subtitle mb-2 text-muted">{{ repo.owner }}</h6>
        {% if repo.description %}
          <p class="card-text">{{ repo.description }}</p>
        {% endif %}
        <a class="btn btn-sm mt-auto" href="{{ repo.url }}" target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-github"></i> View on GitHub
        </a>
      </div>
    </div>
  {% endfor %}
</div>
{% endif %}
