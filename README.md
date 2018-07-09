# ListenListviewSetter widget

A very easy way of making sure that a listview - that is used in a listen-to construction - sets its first list element on a "selected" state when the page is loaded. Making sure that the users of the application get the correct feedback.

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Description

The custom widget is linked to a listview that is used in a listen-to construction. At the moment, such a listview has no user feedback when loaded for the first time. Only after a user selects another item in the listview, the "selected" state will be applied. This widget makes sure that the first element of the list has the "selected" state, making it easy for users to see when a page is loaded

## Implementation steps

1. Give the listview that is used in the listen-to construction a unique name
2. Add the custom widget after the listview and enter the name of the listview in its settings.
3. Run the project.

## Notes
The custom widget is just a UI extension to the way the listview with listen-to dataview already works: if the page is loaded, the first child is automatically selected. The only thing the custom widget adds is the classname that makes the selection visible. It is in no way suited for any special constructs in which the default behaviour of Mendix is overwritten.

## Release Notes
Appstore 1.0 release:
- initial version of the widget