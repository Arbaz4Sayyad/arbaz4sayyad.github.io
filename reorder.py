import re

with open('E:/PortFolio/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# REORDER DESKTOP NAVBAR
desktop_nav_pattern = r'(<div class=\"hidden md:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300\">)(.*?)(<a href=\"#contact\")'
desktop_nav_match = re.search(desktop_nav_pattern, content, re.DOTALL)
if desktop_nav_match:
    new_desktop_nav = '''
          <a href="#about" class="hover:text-primary transition-colors">Home</a>
          <a href="#experience" class="hover:text-primary transition-colors">Experience</a>
          <a href="#opensource" class="hover:text-primary transition-colors whitespace-nowrap">Open Source</a>
          <a href="#projects" class="hover:text-primary transition-colors">Projects</a>
          <a href="#engineering-portfolio" class="hover:text-primary transition-colors whitespace-nowrap">Portfolio</a>
          <a href="#skills" class="hover:text-primary transition-colors">Skills</a>
          <a href="#research" class="hover:text-primary transition-colors">Publications</a>
          <a href="#education" class="hover:text-primary transition-colors">Education</a>

          <a href="https://arbaz4sayyad.github.io/resume/" target="_blank"
            class="hover:text-primary transition-colors">
            <i class="fas fa-file-pdf w-4 text-primary/60"></i> Resume
          </a>

          '''
    content = content[:desktop_nav_match.start(2)] + new_desktop_nav + content[desktop_nav_match.start(3):]

# REORDER FOOTER NAV
footer_nav_pattern = r'(<div\s+class=\"flex flex-wrap justify-center gap-8 text-slate-500 hover:text-slate-900 transition-colors font-medium\">\s*)(.*?)(\s*</div>\s*<div class=\"flex gap-6 text-xl text-slate-500\">)'
footer_nav_match = re.search(footer_nav_pattern, content, re.DOTALL)
if footer_nav_match:
    new_footer_nav = '''<a href="#about" class="hover:text-primary">Home</a>
          <a href="#experience" class="hover:text-primary">Experience</a>
          <a href="#opensource" class="hover:text-primary">Open Source</a>
          <a href="#projects" class="hover:text-primary">Projects</a>
          <a href="#engineering-portfolio" class="hover:text-primary">Portfolio</a>
          <a href="#skills" class="hover:text-primary">Skills</a>
          <a href="#research" class="hover:text-primary">Publications</a>
          <a href="#education" class="hover:text-primary">Education</a>'''
    content = content[:footer_nav_match.start(2)] + new_footer_nav + content[footer_nav_match.start(3):]

# REORDER MOBILE NAV
mobile_nav_pattern = r'(<div class=\"flex flex-col items-center gap-6 text-2xl font-display font-bold\">\s*)(.*?)(\s*</div>\s*</div>\s*<!-- Cursor Trail -->)'
mobile_nav_match = re.search(mobile_nav_pattern, content, re.DOTALL)
if mobile_nav_match:
    new_mobile_nav = '''<a href="#about" class="mobile-link hover:text-primary transition-colors">Home</a>
      <a href="#experience" class="mobile-link hover:text-primary transition-colors">Experience</a>
      <a href="#opensource" class="mobile-link hover:text-primary transition-colors">Open Source</a>
      <a href="#projects" class="mobile-link hover:text-primary transition-colors">Projects</a>
      <a href="#engineering-portfolio" class="mobile-link hover:text-primary transition-colors">Portfolio</a>
      <a href="#skills" class="mobile-link hover:text-primary transition-colors">Skills</a>
      <a href="#research" class="mobile-link hover:text-primary transition-colors">Publications</a>
      <a href="#education" class="mobile-link hover:text-primary transition-colors">Education</a>

      <a href="https://arbaz4sayyad.github.io/resume/" target="_blank"
        class="mobile-link text-primary mt-2">Resume</a>'''
    content = content[:mobile_nav_match.start(2)] + new_mobile_nav + content[mobile_nav_match.start(3):]

# SECTIONS REORDERING
sections = ['about', 'skills', 'projects', 'opensource', 'experience', 'education', 'research', 'engineering-portfolio']
section_contents = {}

for i in range(len(sections)):
    curr_sec = sections[i]
    start_tag = f'<section id="{curr_sec}"'
    start_idx = content.find(start_tag)
    
    # Also find any preceding comments like <!-- About Section --> to include it
    preceding_comment_idx = content.rfind('<!--', 0, start_idx)
    if preceding_comment_idx != -1 and preceding_comment_idx > start_idx - 100:
        actual_start_idx = preceding_comment_idx
    else:
        actual_start_idx = start_idx
    
    next_start_idx = len(content)
    next_section_idx = content.find('<section', start_idx + 10)
    if next_section_idx != -1:
        # Also include any trailing whitespace before the next section
        next_preceding_comment_idx = content.rfind('<!--', 0, next_section_idx)
        if next_preceding_comment_idx != -1 and next_preceding_comment_idx > next_section_idx - 100:
            next_start_idx = next_preceding_comment_idx
        else:
            next_start_idx = next_section_idx
    
    section_contents[curr_sec] = content[actual_start_idx:next_start_idx]

header_end = content.find('<section id="about"')
header_comment_end = content.rfind('<!--', 0, header_end)
if header_comment_end != -1 and header_comment_end > header_end - 100:
    header_end = header_comment_end

footer_start = content.find('<section id="contact"')

if header_end != -1 and footer_start != -1:
    header = content[:header_end]
    footer = content[footer_start:]
    
    new_order = ['about', 'experience', 'opensource', 'projects', 'engineering-portfolio', 'skills', 'research', 'education']
    
    new_content = header
    for sec in new_order:
        new_content += section_contents[sec]
    new_content += footer
    
    with open('E:/PortFolio/index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Successfully reordered nav and sections')
else:
    print('Failed to find header or footer')
