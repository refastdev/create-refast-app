import { Outlet, SelectorLocale, Trans, useText } from '@refastdev/refast';
import { create } from '@refastdev/refast/state';

const { useStore } = create((set, setState) => ({
  text: 'test',
  setText: (text) => {
    set((state) => {
      state.text = text;
    });
  },
}));

export default function App() {
  const { i18n } = useText();
  const state = useStore((state) => state);

  console.log(i18n.tk('custom-key', undefined, 'custom-value-en-US'));
  return (
    <div>
      App
      <div>
        <input
          type="text"
          value={state.text}
          onChange={(e) => state.setText(e.currentTarget.value)}
        />
      </div>
      <div>
        <button className="btn" onClick={() => state.setText('click')}>
          Click Change Input Text
        </button>
      </div>
      <div>
        <div>Locale Text test: {i18n.t('test-en-US')}</div>
        <div>Locale Text test2: {i18n.t('test2-en-US')}</div>
        <div>Locale Text test3: {i18n.t('test3-en-US', undefined, 'custom-key-test3')}</div>
        <div>Locale Text test4: {i18n.t('test4-{name}-en-US', { name: 'dynamic-name' })}</div>
        <div>
          <Trans
            text="test5-{name}-en-US1"
            args={{ name: 'dynamic-trans-name' }}
            customKey="trans-custom-key"
          />
        </div>
        <div>
          <Trans text="test6-{name}-en-US" args={{ name: 'dynamic-trans-name' }} />
        </div>
        <div>
          <Trans text="test7-{name}-en-US" args={{ name: 'dynamic-trans-name' }}></Trans>
        </div>

        <SelectorLocale className="select select-primary" />
        <button
          className="btn"
          onClick={() => {
            i18n.revertLocale();
          }}>
          revert locale setting
        </button>
      </div>
      <div>
        <div>Content:</div>
        <Outlet />
      </div>
    </div>
  );
}
