# What the flotiq_* tools cover for schema work

The `flotiq` subagent works on the project's Flotiq space with these Content Type Definition tools. They call Flotiq's MCP server (`https://mcp.flotiq.com/mcp`) with the project's key, which the tools hold — it isn't in the environment or in any file.

| Tool | Use |
|---|---|
| `flotiq_list_content_types` | List all CTDs by name/label, without schema details. Use it to check what already exists before designing a new type. |
| `flotiq_get_content_type(name)` | Get one full CTD (`schemaDefinition`, `metaDefinition`). Use it before changing a type and to verify a type after creating or updating it. |
| `flotiq_create_content_type(name, label, properties, properties_config, ...)` | Create a new CTD. The schema boilerplate (`type`, `required`, `additionalProperties`, etc.) is added automatically; you pass the fields. The tool's description has the exact format of every field type. |
| `flotiq_update_content_type(name, properties, properties_config, ...)` | **Replace** the field set of an existing CTD. |

Content Object tools (`flotiq_list_objects`, `flotiq_create_object`, `flotiq_update_object`, `flotiq_publish_object`) belong to the `flotiq-content` skill.

## What this means for schema work

* `properties` is the JSON Schema of each field; `properties_config` is its editor config (input type, label, validation, `order`, relation targets). Every field needs an entry in both. See `field-types.md` for which input type to use.
* API names are `a-z` and `_` only (`quiz_topic`, not `quizTopic`); the tool refuses anything else, and the name can't be changed later.
* A relation needs its target type to exist: create the related type first, one call at a time.
* `flotiq_update_content_type` replaces the whole field set, it does not merge. Always start from `flotiq_get_content_type(name)`, change the returned fields, and pass the complete set back. Omitting a field would remove it; the tool refuses that unless `allow_property_removal` is true. Pass that flag only for a removal or rename the lead asked for, never to get past the refusal.
* After `flotiq_create_content_type`/`flotiq_update_content_type`, call `flotiq_get_content_type(name)` and check that fields, required flags, relations and field order match the design.
* A failed call returns Flotiq's error message: read it and fix that field.
* There is no delete tool for CTDs. A type created by mistake is removed by the user in the Flotiq panel — say so in your report.
