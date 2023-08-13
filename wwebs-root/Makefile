all:

gem/%.gem: md/%.md static/footer.gem
	mkdir -p $(shell dirname $@)
	md2gemtext $< $@
	cat static/footer.gem >> $@

html/%.html: md/%.md segment/footer.html.ts segment/header.html.ts
	mkdir -p $(shell dirname $@)
	TITLE="$(shell cat $< | grep '^#' | head -n1 | tail -c +3)" ./segment/header.html.ts > $@
	pandoc --quiet -f markdown -t html $< -o - >> $@
	./segment/footer.html.ts >> $@

pdf/%.pdf: md/%.md
	mkdir -p $(shell dirname $@)
	pandoc --quiet -V geometry:margin=1in -f markdown -t pdf $< -o $@

txt/%.txt: md/%.md
	mkdir -p $(shell dirname $@)
	pandoc --quiet -V geometry:margin=1in -f markdown $< -o $@
	cat static/footer.txt >> $@

wav/%.wav: txt/%.txt
	mkdir -p $(shell dirname $@)
	cat $< | mimic3 --voice en_US/cmu-arctic_low\
		--speaker $(shell cat /root/.local/share/mycroft/mimic3/voices/en_US/cmu-arctic_low/speakers.txt\
			| shuf | head -n1) > $@