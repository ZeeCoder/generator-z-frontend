
### Generator-Z-Frontend


#### Installation and Usage

run `npm install generator-z-frontend -g`

After that, you can run `yo z-frontend` from a project to start the
generator.

#### Description

This is a generator used by the Zalehy Ltd. internally.

#### The rules agreed upon

Every file, that is not going to be directly compiled from sass to css, must be
prefixed with an underscore.

For additional details about a particular file's role, check out the comments.

**Classname naming conventions**

Presentational classes and javascript hooks must be separated.

 - Components must be prefixed with `c-`,
 - Sprite classes must be prefixed with `s-`,
 - Javascript hooks must be prefixed with `js-`.

**The `sprites/` folder**

This folder contains additional folders, like "s-icon".
These folders contains the **png** images which are the source of the
generated sprite images. Also: for every sprite folder, two additional
sass file will be generated, one containing the css rules while the other
containing the sass mixins.

**The `styles/overwrites/` folder**

In this folder only 3rd party overwrites can be placed.
Examples may include: Foundation / Bootstrap, jQuery UI etc.

**The `styles/includes/` folder**

In this folder, only mixins and functions can be placed.
Every mixin and function must have a separate file, and the
filename must be the mixin's / function's name, prefixed with an
underscore, having the following syllables separated by a dash.
Ex.: "_my-mixin.scss", which contains the "my-mixin" mixin.

**The `styles/components/` folder**

- Components must only be imported to the main scss files.
  (Ex.: style.scss)
- File naming convention: "c-a-component".
- Classnames are prefered to tags as the rules' selectors. If the component
  is small enough however (like a btn), and it is certain, that other
  components won't ever be embedded in it, then it can use tag-selectors too.
  (Ex.: "h1", "a" etc.) This is something that needs to be discussed by
  the team working on the project. For a true OOCSS workflow, tag selectors are
  prohibited.
- Colors must be collected to variables and stored in the
  `config/_global.scss` file.

**The `styles/config/global.scss` file**

Color variables and global configurations must be placed here.
Follow the naming conventions presented there strictly.

(ATM) Private trello board: https://trello.com/b/wqSXdT7L
