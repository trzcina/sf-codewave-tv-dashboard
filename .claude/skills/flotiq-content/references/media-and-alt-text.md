# Media and alt text

## Media workflow

1. There is no upload tool: the `flotiq` subagent can't put files into the Media library. The user uploads media in the Flotiq panel, where they also set its title and alt text.
2. Relate existing media: find it with `flotiq_list_objects` on `_media`, and put its reference in the content object's media field (`flotiq_create_object`/`flotiq_update_object`), respecting whether that field allows a single asset or multiple (a gallery).
3. When the space has no fitting media, leave optional media fields empty, and say in your report which objects need which images. Don't invent placeholder URLs or point at unrelated assets.
4. Reuse one media object across content objects when the same asset applies, rather than asking for duplicates.

## Writing alt text

* Alt text describes what the image shows and why it's there — not the filename, not "image of X" boilerplate.
* Keep it concise (roughly one short sentence) and specific: "Red ceramic mug on a wooden table," not "Product photo" or "mug1.jpg."
* For purely decorative images that carry no content meaning, that's a signal to check whether the image field is the right choice at all — but when a value is required, still describe what's shown rather than leaving generic text.
* Don't reuse identical alt text across visually different images just to fill the field.

## Verifying media

After attaching media, confirm:

* The media relation resolves to the correct asset (not an unrelated or leftover upload).
* Alt text is present and specific for every image that conveys meaning.
* Single vs. multiple media fields hold the intended number of assets.

See [Media library](https://flotiq.com/docs/API/media-library/) for upload limits, supported formats, and transformation options.
