const { withAndroidManifest } = require('expo/config-plugins');

module.exports = (config) =>
  withAndroidManifest(config, (c) => {
    const app = c.modResults.manifest.application[0];
    const main = app.activity.find((a) => a.$['android:name'].endsWith('MainActivity'));
    main['intent-filter'] = main['intent-filter'] || [];
    main['intent-filter'].push(
      {
        action: [{ $: { 'android:name': 'android.intent.action.DIAL' } }],
        category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
      },
      {
        action: [{ $: { 'android:name': 'android.intent.action.DIAL' } }],
        category: [
          { $: { 'android:name': 'android.intent.category.DEFAULT' } },
          { $: { 'android:name': 'android.intent.category.BROWSABLE' } },
        ],
        data: [{ $: { 'android:scheme': 'tel' } }],
      }
    );
    return c;
  });
