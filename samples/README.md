# 実行できるサンプルの保守

`lines-to-list.sb3`は、緑の旗でText Linesの3ブロックを実行します。
ステージの変数とリストで、行数`3`・2行目`Banana`・リスト
`Apple, Banana, Cherry`を確認できます。再実行時はリストを置き換えます。

## ファイル構成

- `manifest.json`: PagesのURL、拡張ID・JSパス・sandbox条件、サンプル名と期待結果。
- `<name>/project.json`: Scratch 3の編集可能なプロジェクト。変数・リストは初期状態を保存します。
- `<name>/backdrop.svg`: 自作の説明用背景。外部の素材は不要です。
- `<name>.sb3`: 上記から生成してコミットする配布ファイル。

リポジトリ指定のNode.js（`.nvmrc`）で、追加パッケージなしに実行できます。

```bash
node scripts/build-samples.mjs          # pnpm run samples:build
node scripts/build-samples.mjs --check  # pnpm run samples:check
node scripts/prepare-pages.mjs         # pnpm run pages:build
```

`project.json`の`costumes[].md5ext`は、ソースディレクトリ内の素材ファイル名です。
生成時に素材のMD5とScratch標準のファイル名へ変換し、`extensions`と`extensionURLs`を
設定します。ZIP内の日時を固定するため、同じ入力から同じバイト列を生成します。
`--check`はディスクへ書き込まず、opcode・参照・拡張IDとコミット済みSB3を検査します。
拡張JSを更新した場合も、`samples:build`でSB3を再生成して差分を確認します。

## サンドボックスなしの実行

`extension.unsandboxed: true`の場合、コミット済みの拡張JSを`data:` URLとしてSB3へ
同梱します。TurboWarp公式Editorは、任意のHTTPS URLを参照するプロジェクトには
サンドボックスなしの選択肢を出しません。同梱した拡張では、通常の確認画面で
利用者自身がサンドボックスなしの実行を選択できます。自動で許可する処理はありません。

Text LinesはScratchリストへ直接書き込むため`true`です。READMEのEditorリンクを開き、
拡張の確認画面で**Run without sandbox**を選んで**Allow**し、緑の旗を押します。
拡張本体と背景が同梱されるため、ダウンロード済みのSB3は追加のJS取得を必要としません。

## PagesとREADMEの約束

`pages:build`は`_site/`へ`docs/`・`dist/`・登録されたSB3を集めます。
Pages workflowはこれを公開します。元データやビルド用スクリプトは配信物へコピーしません。

Editorリンクは`https://turbowarp.org/editor?project_url=`に
`<baseURL>samples/<name>.sb3`をURLエンコードして付けます。
READMEと日英ガイドにはEditorリンク・直接ダウンロード・実行操作・期待結果を記載します。
任意の外部URLからの取得にはCORSが必要で、GitHub Pagesは対応しています。
[TurboWarp公式仕様](https://docs.turbowarp.org/url-parameters)を参照してください。

公開後はSB3とJSがHTTP 200で取得できることに加え、権限確認から緑の旗までを
新しいブラウザセッションで確認してください。切戻しはリンクとサンプル配信追加のrevertです。
