---
---
indexCallback([{% for post in site.posts %}
    {
        "id": {{ forloop.index0 }},
        "title": "{{ post.title | xml_escape }}",
        "url": "{{ site.baseurl }}{{ post.url }}",
        "content": "{{ post.content | strip_html | strip_newlines | escape }}"
    }{% if forloop.last == false %},{% endif %}
{% endfor %}]);
