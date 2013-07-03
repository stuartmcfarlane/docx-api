# docx-api

This is intended a to be an http api to convert a web page to a MS Word docx document.

The real work is done by the [docx-transform](https://github.com/stuartmcfarlane/docx-transform) module 
which is a stream transform that takes a stream of html and produces a srteam of docx. My original 
motivation for this was have my online CV available to recruiters with an unholy preference
for word format documents. As it turns out producing a word document that looks like an arbitary web page is quite a diffucult problem to solve in any general way.

## Running it


If anyone has a solution to this problem please feel free to have a look at [docx-transform](https://github.com/stuartmcfarlane/docx-transform) and drop your code into it.